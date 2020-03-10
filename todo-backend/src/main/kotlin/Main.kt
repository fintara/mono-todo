package com.tsovedenski.todo

import com.tsovedenski.todo.database.ExposedTxProvider
import com.tsovedenski.todo.database.TxProvider
import com.tsovedenski.todo.exceptions.EntityNotFoundException
import com.tsovedenski.todo.handlers.AuthHandler
import com.tsovedenski.todo.handlers.PingPongHandler
import com.tsovedenski.todo.handlers.TodosHandler
import com.tsovedenski.todo.handlers.UsersHandler
import com.tsovedenski.todo.services.TodoService
import com.tsovedenski.todo.services.TodoServiceImpl
import com.tsovedenski.todo.services.UserService
import com.tsovedenski.todo.services.UserServiceImpl
import org.http4k.cloudnative.env.Environment
import org.http4k.core.*
import org.http4k.core.Method.*
import org.http4k.filter.ServerFilters
import org.http4k.lens.RequestContextKey
import org.http4k.routing.RoutingHttpHandler
import org.http4k.routing.bind
import org.http4k.routing.routes
import org.http4k.server.Jetty
import org.http4k.server.asServer
import java.time.Instant

/**
 * Created by Tsvetan Ovedenski on 02/03/2020.
 */
fun main() {
    val config = cloudnativeConfig(Environment.JVM_PROPERTIES, defaultConfig())
    val app = App(config)
    app.asServer(Jetty(8080)).start().block()
}

class App(
    val config: Config,

    val instantProvider: InstantProvider = { Instant.now() },
    val txProvider: TxProvider = ExposedTxProvider.create(config.database),
    val passwordEncoder: PasswordEncoder = BcryptPasswordEncoder,

    val userService: UserService = UserServiceImpl(passwordEncoder, txProvider.users),
    val todoService: TodoService = TodoServiceImpl(instantProvider, txProvider.todos),

    val authenticator: Authenticator = InMemoryAuthenticator(userService::findById)
) : HttpHandler {
    private val contexts = RequestContexts()
    private val credentials = RequestContextKey.required<Authentication>(contexts)
    private val authenticated = ServerFilters.BearerAuth(credentials, authenticator::authenticate)

    private val routes = createRoutes()

    override fun invoke(request: Request): Response = ServerFilters.InitialiseRequestContext(contexts)
        .then(catchExceptions())
        .then(routes)(request)

    private fun createRoutes(): RoutingHttpHandler {
        val authHandler = AuthHandler(
            authenticator,
            userService::findByCredentials,
            userService::create.asUnit() // https://youtrack.jetbrains.com/issue/KT-11723
        )

        val usersHandler = UsersHandler(
            credentials,
            userService::findById
        )

        val todosHandler = TodosHandler(
            credentials,
            todoService::findAll,
            todoService::findOne,
            todoService::create,
            todoService::update,
            todoService::delete
        )

        return routes(
            "/ping" bind GET to PingPongHandler(instantProvider),

            "/auth" bind routes(
                "/login"  bind POST to authHandler::login,
                "/signup" bind POST to authHandler::signup
            ),

            "/users" bind authenticated.then(routes(
                "/me" bind GET to usersHandler::me
            )),

            "/todos" bind authenticated.then(routes(
                "/"     bind GET to todosHandler::findAll,
                "/{id}" bind GET to todosHandler::findOne,
                "/"     bind POST to todosHandler::create,
                "/{id}" bind PATCH to todosHandler::patch,
                "/{id}" bind DELETE to todosHandler::delete
            ))
        )
    }

    private fun catchExceptions(): Filter = Filter { next ->
        { req ->
            try {
                next(req)
            } catch (e: EntityNotFoundException) {
                Response(Status.NOT_FOUND)
            } catch (e: Throwable) {
                e.printStackTrace()
                Response(Status.INTERNAL_SERVER_ERROR)
            }
        }
    }
}

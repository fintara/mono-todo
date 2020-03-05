package com.tsovedenski.todo

import com.tsovedenski.todo.database.ExposedTxProvider
import com.tsovedenski.todo.database.TxProvider
import com.tsovedenski.todo.handlers.AuthHandler
import com.tsovedenski.todo.handlers.PingPongHandler
import com.tsovedenski.todo.services.UserService
import com.tsovedenski.todo.services.UserServiceImpl
import org.http4k.cloudnative.env.Environment
import org.http4k.core.*
import org.http4k.core.Method.GET
import org.http4k.core.Method.POST
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
    app.asRouter().asServer(Jetty(8080)).start().block()
}

class App(
    private val config: Config,

    private val instantProvider: Provider<Instant> = { Instant.now() },
    private val txProvider: TxProvider = ExposedTxProvider.create(config.database),
    private val passwordEncoder: PasswordEncoder = BcryptPasswordEncoder,

    private val userService: UserService = UserServiceImpl(passwordEncoder, txProvider.users),

    private val authenticator: Authenticator = InMemoryAuthenticator(userService::findById)
) {
    private val contexts = RequestContexts()
    private val credentials = RequestContextKey.required<Authentication>(contexts)
    private val authenticated = ServerFilters.BearerAuth(credentials, authenticator::authenticate)

    private val routes = createRoutes()

    fun asRouter(): RoutingHttpHandler = catchExceptions()
        .then(routes)

    private fun createRoutes(): RoutingHttpHandler {
        val authHandler = AuthHandler(
            authenticator,
            userService::findByCredentials,
            userService::create.asUnit()
        )

        return routes(
            "/ping" bind GET to PingPongHandler(instantProvider),

            "/auth" bind routes(
                "/login" bind POST to authHandler::login,
                "/signup" bind POST to authHandler::signup
            ),

            "/todos" bind authenticated.then(routes(
                "/" bind GET to { Response(Status.OK) }
            ))
        )
    }

    private fun catchExceptions(): Filter = Filter { next ->
        { req ->
            try {
                next(req)
            } catch (e: Throwable) {
                e.printStackTrace()
                Response(Status.INTERNAL_SERVER_ERROR)
            }
        }
    }
}

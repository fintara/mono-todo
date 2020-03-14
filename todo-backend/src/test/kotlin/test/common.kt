package com.tsovedenski.todo.test

import com.tsovedenski.todo.*
import com.tsovedenski.todo.database.ExposedTxProvider
import com.tsovedenski.todo.database.TxProvider
import com.tsovedenski.todo.models.User
import org.http4k.core.*
import java.time.Instant
import kotlin.random.Random

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */
class TestApp(private val app: App): HttpHandler by app {
    val txProvider get() = app.txProvider
    val instantProvider get() = app.instantProvider

    fun resetDatabase() = with (txProvider) {
        todos.tx { deleteAll() }
        users.tx { deleteAll() }
    }

    fun authenticate(
        email: String = "test@example.com",
        password: String = Random.Default.nextBytes(32).toString(),
        name: String? = null
    ): Authentication {
        val user = txProvider.users.tx {
            findByEmail(email) ?: run {
                val user = User(email, password, name)
                insert(user).let(::findById)!!
            }
        }
        return Authentication(user.id)
    }

    fun withAuth(
        email: String = "test@example.com",
        password: String = Random.Default.nextBytes(32).toString(),
        name: String? = null,
        block: HttpHandler.() -> Response
    ) =
        withAuth(authenticate(email, password, name), block)

    fun withAuth(authentication: Authentication, block: HttpHandler.() -> Response) =
        with (applyAuthentication(authentication), block)

    private fun applyAuthentication(authentication: Authentication): HttpHandler {
        val token = app.authenticator.token(authentication)
        return Filter { next ->
            { req -> next(req.header("Authorization", "Bearer $token")) }
        }.then(this)
    }
}

fun createTestApp(
    config: Config = defaultConfig(),
    txProvider: TxProvider = createTestTxProvider(),
    instantProvider: Provider<Instant> = { Instant.now() }
): TestApp = TestApp(
    App(
        config = config,
        txProvider = txProvider,
        instantProvider = instantProvider
    )
)

fun createTestTxProvider(): TxProvider {
    // since we are using H2, we can directly use that
    return ExposedTxProvider.create(DatabaseConfig.h2())
}

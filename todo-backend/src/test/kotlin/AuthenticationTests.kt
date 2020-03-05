package com.tsovedenski.todo

import com.tsovedenski.todo.database.TxProvider
import com.tsovedenski.todo.test.assertThat
import com.tsovedenski.todo.test.createTestApp
import com.tsovedenski.todo.test.createTestTxProvider
import org.assertj.core.api.Assertions.assertThat
import org.http4k.core.HttpHandler
import org.http4k.core.Method.*
import org.http4k.core.Request
import org.http4k.core.Response
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */
class AuthenticationTests {

    private val txProvider: TxProvider = createTestTxProvider()

    lateinit var app: HttpHandler

    @BeforeEach
    fun setup() {
        txProvider.users.tx { deleteAll() }
        app = createTestApp(txProvider = txProvider)
    }

    @Test
    fun `cannot log in with invalid credentials`() =
        assertThat(login("test@gmail.com", "1234567890")) {
            status.is4xx
        }

    @Test
    fun `can log in after registration`() {
        val email = "test@gmail.com"
        val password = "ver1s3cr3t"

        assertThat(signup(email, password)) {
            status.is2xx
        }

        assertThat(login(email, password)) {
            status.is2xx
            json {
                isObject.containsKey("token")
                inPath("$.token").isString.isNotBlank
            }
        }
    }

    @Test
    fun `password is not stored in plaintext`() {
        val email = "test@gmail.com"
        val password = "ver1s3cr3t"

        assertThat(signup(email, password)) {
            status.is2xx
        }

        val user = txProvider.users.tx { findByEmail(email) }

        requireNotNull(user) { "user is null" }

        assertThat(user.payload.password).isNotEqualTo(password)
    }

    @Test
    fun `name is stored`() {
        val email = "john@gmail.com"
        val name = "John Doe"

        assertThat(signup(email, "secret", name)) {
            status.is2xx
        }

        val user = txProvider.users.tx { findByEmail(email) }

        requireNotNull(user) { "user is null" }

        assertThat(user.payload.name).isEqualTo(name)
    }

    private fun signup(email: String, password: String, name: String? = null): Response {
        val body = buildString {
            append("{")
            append(""" "email":"$email", """)
            append(""" "password":"$password" """)
            if (name != null) {
                append(""", "name":"$name" """)
            }
            append("}")
        }

        val request = Request(POST, "/auth/signup").body(body)

        return app(request)
    }

    private fun login(email: String, password: String): Response {
        val body = """{"email":"$email","password":"$password"}"""

        val request = Request(POST, "/auth/login").body(body)

        return app(request)
    }
}
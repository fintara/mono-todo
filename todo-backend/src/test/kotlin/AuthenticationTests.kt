package com.tsovedenski.todo

import com.tsovedenski.todo.test.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */
class AuthenticationTests {

    lateinit var app: TestApp

    @BeforeEach
    fun setup() {
        app = createTestApp().apply { resetDatabase() }
    }

    @Test
    fun `cannot log in with invalid credentials`() =
        assertResponse(app.auth.login("test@gmail.com", "1234567890")) {
            status.is4xx
        }

    @Test
    fun `can log in after registration`() {
        val email = "test@gmail.com"
        val password = "ver1s3cr3t"

        assertResponse(app.auth.signup(email, password)) {
            status.is2xx
        }

        assertResponse(app.auth.login(email, password)) {
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

        assertResponse(app.auth.signup(email, password)) {
            status.is2xx
        }

        val user = app.txProvider.users.tx { findByEmail(email) }

        requireNotNull(user) { "user is null" }

        assertThat(user.payload.password).isNotEqualTo(password)
    }

    @Test
    fun `name is stored`() {
        val email = "john@gmail.com"
        val name = "John Doe"

        assertResponse(app.auth.signup(email, "secret", name)) {
            status.is2xx
        }

        val user = app.txProvider.users.tx { findByEmail(email) }

        requireNotNull(user) { "user is null" }

        assertThat(user.payload.name).isEqualTo(name)
    }
}
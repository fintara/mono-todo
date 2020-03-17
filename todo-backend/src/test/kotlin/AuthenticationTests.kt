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

    private fun cannotLoginTest(
        email: String,
        password: String
    ) = assertResponse(app.auth.login(email, password)) {
        status.is4xx
    }

    @Test
    fun `cannot log in with invalid credentials`() =
        cannotLoginTest("test@gmail.com", "1234567890")

    @Test
    fun `cannot log in with invalid email`() =
        cannotLoginTest("test", "1234567890")

    @Test
    fun `cannot log in with short password`() =
        cannotLoginTest("test@gmail.com", "123")

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

    private fun cannotRegisterTest(
        email: String,
        password: String,
        name: String?
    ) = assertResponse(app.auth.signup(email, password, name)) {
        status.is4xx
    }

    @Test
    fun `cannot register with invalid email`() =
        cannotRegisterTest("test", "123456789", null)

    @Test
    fun `cannot register with already existing email`() {
        val email = "test@gmail.com"

        assertResponse(app.auth.signup(email, "123456789", null)) {
            status.is2xx
        }

        cannotRegisterTest(email, "qwertyuiop", null)
    }

    @Test
    fun `cannot register with short password`() =
        cannotRegisterTest("test@gmail.com", "123", null)

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
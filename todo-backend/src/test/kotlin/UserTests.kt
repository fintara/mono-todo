package com.tsovedenski.todo

import com.tsovedenski.todo.test.TestApp
import com.tsovedenski.todo.test.assertResponse
import com.tsovedenski.todo.test.createTestApp
import com.tsovedenski.todo.test.users
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

/**
 * Created by Tsvetan Ovedenski on 10/03/2020.
 */
class UserTests {

    lateinit var app: TestApp

    @BeforeEach
    fun setup() {
        app = createTestApp()
    }

    @Test
    fun `accessing me without authentication is forbidden`() = assertResponse(app.users.me()) {
        status.is4xx
    }

    @Test
    fun `me returns email if name is empty`() {
        val email = "test@gmail.com"
        val auth = app.authenticate(email = email)

        assertResponse(app.withAuth(auth) { users.me() }) {
            status.is2xx
            json {
                isObject.containsKey("name")
                inPath("$.name").isString.isEqualTo(email)
            }
        }
    }

    @Test
    fun `me returns name if name is not empty`() {
        val name = "John"
        val auth = app.authenticate(name = name)

        assertResponse(app.withAuth(auth) { users.me() }) {
            status.is2xx
            json {
                isObject.containsKey("name")
                inPath("$.name").isString.isEqualTo(name)
            }
        }
    }
}
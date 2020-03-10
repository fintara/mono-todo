package com.tsovedenski.todo

import com.tsovedenski.todo.models.Todo
import com.tsovedenski.todo.models.TodoCreate
import com.tsovedenski.todo.models.TodoId
import com.tsovedenski.todo.models.TodoPatch
import com.tsovedenski.todo.test.TestApp
import com.tsovedenski.todo.test.assertResponse
import com.tsovedenski.todo.test.createTestApp
import com.tsovedenski.todo.test.todos
import org.assertj.core.api.Assertions.assertThat
import org.http4k.core.HttpHandler
import org.http4k.core.Method.*
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

/**
 * Created by Tsvetan Ovedenski on 07/03/2020.
 */
class TodoTests {

    lateinit var app: TestApp

    @BeforeEach
    fun setup() {
        app = createTestApp()
    }

    @Test
    fun `listing all todos requires authentication`() = assertResponse(app.todos.findAll()) {
        status.is4xx
    }

    @Test
    fun `lists all todos by user`() = assertResponse(app.withAuth { todos.findAll() }) {
        status.is2xx
        json.isArray
    }

    @Test
    fun `patches by id`() {
        val auth = app.authenticate()
        val todo = app.txProvider.todos.tx {
            insert(Todo(auth.userId, "test", false, app.instantProvider())).let(::findById)!!
        }
        val patch = TodoPatch("edited todo", !todo.payload.done)

        app.withAuth { todos.patch(todo.id, patch) }

        val updated = app.txProvider.todos.tx { findById(todo.id) }

        requireNotNull(updated)

        assertThat(updated.payload.content).isEqualTo(patch.content)
        assertThat(updated.payload.done).isEqualTo(patch.done)
    }

    @Test
    fun `deletes by id`() {
        val auth = app.authenticate()
        val todoId = app.txProvider.todos.tx { insert(Todo(auth.userId, "test", true, app.instantProvider())) }

        assertResponse(app.withAuth(auth) { todos.delete(todoId) }) {
            status.is2xx
        }

        assertThat(app.txProvider.todos.tx { findById(todoId) }).isNull()
    }
}
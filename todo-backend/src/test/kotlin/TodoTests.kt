package com.tsovedenski.todo

import com.tsovedenski.todo.models.Todo
import com.tsovedenski.todo.models.TodoCreate
import com.tsovedenski.todo.models.TodoId
import com.tsovedenski.todo.models.TodoPatch
import com.tsovedenski.todo.test.TestApp
import com.tsovedenski.todo.test.assertResponse
import com.tsovedenski.todo.test.createTestApp
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
    fun `listing all todos requires authentication`() = assertResponse(app.findAll()) {
        status.is4xx
    }

    @Test
    fun `lists all todos by user`() = assertResponse(app.withAuth { findAll() }) {
        status.is2xx
        json {
            isArray
        }
    }

    @Test
    fun `patches by id`() {
        val auth = app.authenticate()
        val todo = app.app.todoService.create(TodoCreate("test"), auth.userId)
        val patch = TodoPatch("edited todo", !todo.payload.done)

        app.withAuth { patch(todo.id, patch) }

        val updated = app.txProvider.todos.tx { findById(todo.id) }

        requireNotNull(updated)

        assertThat(updated.payload.content).isEqualTo(patch.content)
        assertThat(updated.payload.done).isEqualTo(patch.done)
    }

    @Test
    fun `deletes by id`() {
        val auth = app.authenticate()
        val todoId = app.txProvider.todos.tx { insert(Todo(auth.userId, "test", true, app.instantProvider())) }

        assertResponse(app.withAuth(auth) { delete(todoId) }) {
            status.is2xx
        }

        assertThat(app.txProvider.todos.tx { findById(todoId) }).isNull()
    }

    private fun HttpHandler.findAll(): Response {
        val request = Request(GET, "/todos")
        return this(request)
    }

    private fun HttpHandler.patch(id: TodoId, patch: TodoPatch): Response {
        val json = Jackson.asJsonString(patch)
        val request = Request(PATCH, "/todos/$id").body(json)
        return this(request)
    }

    private fun HttpHandler.delete(id: TodoId): Response {
        val request = Request(DELETE, "/todos/$id")
        return this(request)
    }
}
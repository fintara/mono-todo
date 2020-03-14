package com.tsovedenski.todo

import com.tsovedenski.todo.database.Entity
import com.tsovedenski.todo.models.*
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
import java.time.Instant

/**
 * Created by Tsvetan Ovedenski on 07/03/2020.
 */
class TodoTests {

    lateinit var app: TestApp

    @BeforeEach
    fun setup() {
        app = createTestApp().apply { resetDatabase() }
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
    fun `creates a todo`() {
        val auth = app.authenticate()
        val form = TodoCreate("Test todo")

        assertResponse(app.withAuth(auth) { todos.create(form) }) {
            status.is2xx
            json {
                isObject.containsKeys("id", "content", "done")
                inPath("$.id").isString.isNotBlank
                inPath("$.content").isString.isEqualTo(form.content)
                inPath("$.done").isBoolean.isFalse
            }
        }
    }

    private fun prepareTodo(): Pair<Authentication, TodoEntity> {
        val auth = app.authenticate()
        val todo = app.txProvider.todos.tx {
            insert(Todo(auth.userId, "test", null, null, app.instantProvider())).let(::findById)!!
        }
        return auth to todo
    }

    @Test
    fun `patches by id`() {
        val now = Instant.ofEpochSecond(1584183382)
        app = createTestApp(instantProvider = { now })

        val (auth, todo) = prepareTodo()
        val patch = TodoPatch(
            content = "edited todo",
            done = !todo.payload.done
        )

        app.withAuth(auth) { todos.patch(todo.id, patch) }

        val updated = app.txProvider.todos.tx { findById(todo.id) }

        requireNotNull(updated)

        assertThat(updated.payload.content).isEqualTo(patch.content)
        assertThat(updated.payload.doneAt).isEqualTo(now)
        assertThat(updated.payload.done).isEqualTo(patch.done)
    }

    @Test
    fun `sets deadline`() {
        val now = Instant.ofEpochSecond(1584183382)
        val deadline = now.plusSeconds(86400)

        app = createTestApp(instantProvider = { now })

        val (auth, todo) = prepareTodo()
        val patch = TodoPatch(deadline = deadline)

        assertResponse(app.withAuth(auth) { todos.patch(todo.id, patch) }) {
            status.is2xx
            json {
                isObject.containsKey("deadline")
                inPath("$.deadline").isString.isEqualTo(deadline.toString())
            }
        }
    }

    @Test
    fun `cannot set deadline in the past`() {
        val now = Instant.ofEpochSecond(1584183382)
        val deadline = now.minusSeconds(86400)

        app = createTestApp(instantProvider = { now })

        val (auth, todo) = prepareTodo()
        val patch = TodoPatch(deadline = deadline)

        assertResponse(app.withAuth(auth) { todos.patch(todo.id, patch) }) {
            status.is2xx
            json {
                isObject.containsKey("deadline")
                inPath("$.deadline").isNull()
            }
        }
    }

    @Test
    fun `removes deadline`() {
        val now = Instant.ofEpochSecond(1584183382)
        val deadline = Instant.ofEpochSecond(0)

        app = createTestApp(instantProvider = { now })

        val (auth, todo) = prepareTodo()
        app.txProvider.todos.tx { save(todo.id, todo.payload.copy(deadline = Instant.ofEpochSecond(1584183382 + 86400))) }

        val patch = TodoPatch(deadline = deadline)

        assertResponse(app.withAuth(auth) { todos.patch(todo.id, patch) }) {
            status.is2xx
            json {
                isObject.containsKey("deadline")
                inPath("$.deadline").isNull()
            }
        }
    }

    @Test
    fun `patch does not change fields when empty`() {
        val (auth, todo) = prepareTodo()
        val deadline = app.instantProvider().plusSeconds(86400)
        app.txProvider.todos.tx { save(todo.id, todo.payload.copy(deadline = deadline)) }

        val patch = TodoPatch()

        assertResponse(app.withAuth(auth) { todos.patch(todo.id, patch) }) {
            status.is2xx
            json {
                isObject.containsKeys("id", "content", "done", "deadline")
                inPath("$.id").isString.isEqualTo(todo.id.toString())
                inPath("$.content").isString.isEqualTo(todo.payload.content)
                inPath("$.deadline").isString.isEqualTo(deadline.toString())
                inPath("$.done").isBoolean.isEqualTo(todo.payload.done)
            }
        }
    }

    @Test
    fun `deletes by id`() {
        val auth = app.authenticate()
        val todoId = app.txProvider.todos.tx { insert(Todo(auth.userId, "test", null, app.instantProvider(), app.instantProvider())) }

        assertResponse(app.withAuth(auth) { todos.delete(todoId) }) {
            status.is2xx
        }

        assertThat(app.txProvider.todos.tx { findById(todoId) }).isNull()
    }
}
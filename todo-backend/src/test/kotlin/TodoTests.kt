package com.tsovedenski.todo

import com.tsovedenski.todo.database.Entity
import com.tsovedenski.todo.models.*
import com.tsovedenski.todo.test.*
import org.assertj.core.api.Assertions.assertThat
import org.http4k.core.HttpHandler
import org.http4k.core.Method.*
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.Instant
import java.util.*

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
    fun `listing all todos requires authentication`() =
        assertRequiresAuthentication(app.todos.findAll())

    @Test
    fun `lists all todos by user`() {
        val auth = app.authenticate()
        val list = app.txProvider.todos.tx {
            listOf(
                Todo(auth.userId, "First", null, null, app.instantProvider()),
                Todo(auth.userId, "Second one", app.instantProvider().plusSeconds(3600), null, app.instantProvider()),
                Todo(auth.userId, "Three and four", null, app.instantProvider().plusSeconds(3600), app.instantProvider()),
                Todo(auth.userId, "Three and four", app.instantProvider().plusSeconds(3600), app.instantProvider().plusSeconds(3600*2), app.instantProvider())
            ).map { insert(it) }.mapNotNull { findById(it) }
        }

        assertResponse(app.withAuth(auth) { todos.findAll() }) {
            status.is2xx
            json {
                isArray.hasSameSizeAs(list)

                inPath("$[0].content").isString.isEqualTo(list[0].payload.content)
                inPath("$[0].deadline").isNull()
                inPath("$[0].done").isBoolean.isFalse

                inPath("$[1].content").isString.isEqualTo(list[1].payload.content)
                inPath("$[1].deadline").isString.isNotBlank
                inPath("$[1].done").isBoolean.isFalse

                inPath("$[2].content").isString.isEqualTo(list[2].payload.content)
                inPath("$[2].deadline").isNull()
                inPath("$[2].done").isBoolean.isTrue

                inPath("$[3].content").isString.isEqualTo(list[3].payload.content)
                inPath("$[3].deadline").isString.isNotBlank
                inPath("$[3].done").isBoolean.isTrue

            }
        }
    }

    @Test
    fun `creating a todo requires authentication`() =
        assertRequiresAuthentication(app.todos.create(TodoCreate("test")))

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

    @Test
    fun `todo content is trimmed`() {
        val form = TodoCreate("  test 5\t")

        assertResponse(app.withAuth { todos.create(form) }) {
            status.is2xx
            json {
                isObject.containsKey("content")
                inPath("$.content").isString.isEqualTo("test 5")
            }
        }
    }

    private fun cannotCreateTodo(content: String) = assertResponse(app.withAuth { todos.create(TodoCreate(content)) }) {
        status.is4xx
    }

    @Test fun `cannot create todo with empty string`() = cannotCreateTodo("")
    @Test fun `cannot create todo with blank string`() = cannotCreateTodo("     ")

    private fun prepareTodo(): Pair<Authentication, TodoEntity> {
        val auth = app.authenticate()
        val todo = app.txProvider.todos.tx {
            insert(Todo(auth.userId, "test", null, null, app.instantProvider())).let(::findById)!!
        }
        return auth to todo
    }

    @Test
    fun `patching by id requires authentication`() =
        assertRequiresAuthentication(app.todos.patch(UUID.randomUUID(), TodoPatch()))

    @Test
    fun `patching non-existing todo results in 404`() =
        app.withAuth { todos.patch(UUID.randomUUID(), TodoPatch()) }
            .let(::assertResponseNotFound)

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
    fun `patched todo content is trimmed`() {
        val (auth, todo) = prepareTodo()
        val patch = TodoPatch("  test 5\t")

        assertResponse(app.withAuth(auth) { todos.patch(todo.id, patch) }) {
            status.is2xx
            json {
                isObject.containsKey("content")
                inPath("$.content").isString.isEqualTo("test 5")
            }
        }
    }

    @Test
    fun `patched content cannot be blank`() {
        val (auth, todo) = prepareTodo()
        require(!todo.payload.done)

        val patch = TodoPatch(content = "  ", done = true)

        assertResponse(app.withAuth(auth) { todos.patch(todo.id, patch) }) {
            status.is4xx
        }

        val fresh = app.txProvider.todos.tx { findById(todo.id)!! }

        assertThat(fresh.payload.content).isEqualTo(todo.payload.content)
        assertThat(fresh.payload.done).isEqualTo(todo.payload.done)
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
    fun `deleting by id requires authentication`() =
        assertRequiresAuthentication(app.todos.delete(UUID.randomUUID()))

    @Test
    fun `deleting non-existing todo does not fail`() {
        val response = app.withAuth { todos.delete(UUID.randomUUID()) }
        assertResponse(response) {
            status.is2xx
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
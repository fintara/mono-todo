package com.tsovedenski.todo.models

import com.tsovedenski.todo.*
import com.tsovedenski.todo.annotations.Typescript
import com.tsovedenski.todo.database.Entity
import java.time.Instant
import java.util.*

/**
 * Created by Tsvetan Ovedenski on 07/03/2020.
 */

private fun <T> Spec<T>.content(selector: (T) -> String?) = field(selector, "content") {
    notBlank
}

@Typescript
data class TodoCreate(
    val content: String
) {
    companion object {
        val validator = createValidator<TodoCreate> {
            content(TodoCreate::content)
        }
    }
}

@Typescript
typealias TodoId = UUID

@Typescript
data class TodoPatch(
    val content: String? = null,
    val done: Boolean? = null,
    val deadline: Instant? = null
) {
    companion object {
        val validator = createValidator<TodoPatch> {
            content(TodoPatch::content)
        }
    }
}

data class Todo(
    val userId: UserId,
    val content: String,
    val deadline: Instant?,
    val doneAt: Instant?,
    val createdAt: Instant
) {
    val done get() = doneAt != null
}

fun Todo.apply(patch: TodoPatch, now: InstantProvider): Todo {
    var out = this.copy()

    patch.content?.let { out = out.copy(content = it.trim()) }
    patch.done?.let { out = out.copy(doneAt = if (it) now() else null) }
    patch.deadline?.let { out = out.copy(deadline = it.takeIf { it.isAfter(out.createdAt) }) }

    return out
}

typealias TodoEntity = Entity<TodoId, Todo>

@Typescript
data class TodoDTO(
    val id: TodoId,
    val content: String,
    val done: Boolean,
    val deadline: Instant?,
    val createdAt: Instant
)

fun TodoEntity.toDTO() = TodoDTO(
    id = id,
    content = payload.content,
    done = payload.done,
    deadline = payload.deadline,
    createdAt = payload.createdAt
)
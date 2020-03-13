package com.tsovedenski.todo.models

import com.tsovedenski.todo.InstantProvider
import com.tsovedenski.todo.annotations.Typescript
import com.tsovedenski.todo.database.Entity
import java.time.Instant
import java.util.*

/**
 * Created by Tsvetan Ovedenski on 07/03/2020.
 */

@Typescript
data class TodoCreate (
    val content: String
)

@Typescript
typealias TodoId = UUID

@Typescript
data class TodoDTO (
    val id: TodoId,
    val content: String,
    val done: Boolean
)

@Typescript
data class TodoPatch (
    val content: String?,
    val done: Boolean?
)

data class Todo (
    val userId: UserId,
    val content: String,
    val doneAt: Instant?,
    val createdAt: Instant
) {
    val done get() = doneAt != null
}

fun Todo.apply(patch: TodoPatch, now: InstantProvider): Todo {
    var out = this.copy()

    patch.content?.let { out = out.copy(content = it) }
    patch.done?.let { out = out.copy(doneAt = if (it) now() else null) }

    return out
}

typealias TodoEntity = Entity<TodoId, Todo>

fun TodoEntity.toDTO() = TodoDTO(
    id = id,
    content = payload.content,
    done = payload.done
)
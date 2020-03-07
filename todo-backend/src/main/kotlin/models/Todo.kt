package com.tsovedenski.todo.models

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
) {
    fun patch (item: Todo): Todo {
        var out = item.copy()

        content?.let { out = out.copy(content = it) }
        done?.let { out = out.copy(done = it) }

        return out
    }
}

data class Todo (
    val userId: UserId,
    val content: String,
    val done: Boolean,
    val createdAt: Instant
)

typealias TodoEntity = Entity<TodoId, Todo>

fun TodoEntity.toDTO() = TodoDTO(
    id = id,
    content = payload.content,
    done = payload.done
)
package com.tsovedenski.todo.database.repositories

import com.tsovedenski.todo.database.Todos
import com.tsovedenski.todo.database.Users
import com.tsovedenski.todo.models.Todo
import com.tsovedenski.todo.models.TodoEntity
import com.tsovedenski.todo.models.TodoId
import com.tsovedenski.todo.models.UserId
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.*

/**
 * Created by Tsvetan Ovedenski on 07/03/2020.
 */
interface TodoRepository : CrudRepository<TodoId, Todo> {
    fun findByUserId(userId: UserId): List<TodoEntity>
}

object ExposedTodoRepository : TodoRepository {
    override fun findById(id: TodoId): TodoEntity? = Todos
        .select { Todos.id eq id }
        .firstOrNull()
        ?.toTodo()

    override fun findByUserId(userId: UserId): List<TodoEntity> = Todos
        .select { Todos.userId eq userId }
        .map(ResultRow::toTodo)

    override fun insert(item: Todo): TodoId = Todos.insertAndGetId {
        it[userId] = EntityID(item.userId, Users)
        it[content] = item.content
        it[doneAt] = item.doneAt
        it[createdAt] = item.createdAt
    }.value

    override fun save(id: TodoId, item: Todo) {
        Todos.update({ Todos.id eq id }) {
            it[content] = item.content
            it[doneAt] = item.doneAt
        }
    }

    override fun deleteById(id: TodoId) {
        Todos.deleteWhere { Todos.id eq id }
    }

    override fun deleteAll() {
        Todos.deleteAll()
    }
}

fun ResultRow.toTodo() = TodoEntity(
    id = this[Todos.id].value,
    payload = Todo(
        userId = this[Todos.userId].value,
        content = this[Todos.content],
        doneAt = this[Todos.doneAt],
        createdAt = this[Todos.createdAt]
    )
)
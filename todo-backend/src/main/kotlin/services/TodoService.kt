package com.tsovedenski.todo.services

import com.tsovedenski.todo.InstantProvider
import com.tsovedenski.todo.database.TxManager
import com.tsovedenski.todo.database.repositories.TodoRepository
import com.tsovedenski.todo.exceptions.DatabaseException
import com.tsovedenski.todo.models.*

/**
 * Created by Tsvetan Ovedenski on 07/03/2020.
 */
interface TodoService {
    fun findAll(userId: UserId): List<TodoEntity>
    fun findOne(todoId: TodoId): TodoEntity?
    fun create(item: TodoCreate, userId: UserId): TodoEntity
    fun update(todo: TodoEntity, patch: TodoPatch): TodoEntity
    fun delete(todoId: TodoId)
}

class TodoServiceImpl (
    private val now: InstantProvider,
    private val tx: TxManager<TodoRepository>
) : TodoService {

    override fun findAll(userId: UserId): List<TodoEntity> = tx {
        findByUserId(userId)
    }

    override fun findOne(todoId: TodoId): TodoEntity? = tx {
        findById(todoId)
    }

    override fun create(item: TodoCreate, userId: UserId): TodoEntity = tx {
        val todo = Todo(userId, item.content, null, null, now())
        val id = insert(todo)
        findById(id) ?: throw DatabaseException.CouldNotInsert
    }

    override fun update(todo: TodoEntity, patch: TodoPatch): TodoEntity = tx {
        val patched = todo.payload.apply(patch, now)
        save(todo.id, patched)
        findById(todo.id) ?: throw DatabaseException.CouldNotUpdate
    }

    override fun delete(todoId: TodoId) = tx {
        deleteById(todoId)
    }
}
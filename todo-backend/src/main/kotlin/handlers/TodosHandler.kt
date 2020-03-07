package com.tsovedenski.todo.handlers

import com.tsovedenski.todo.Authentication
import com.tsovedenski.todo.andThen
import com.tsovedenski.todo.bodyLens
import com.tsovedenski.todo.exceptions.EntityNotFoundException
import com.tsovedenski.todo.models.*
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status
import org.http4k.core.with
import org.http4k.lens.BiDiPathLens
import org.http4k.lens.Path
import org.http4k.lens.uuid

/**
 * Created by Tsvetan Ovedenski on 07/03/2020.
 */
class TodosHandler (
    private val credentials: (Request) -> Authentication,
    private val findTodos: (UserId) -> List<TodoEntity>,
    private val findTodo: (TodoId) -> TodoEntity?,
    private val createTodo: (TodoCreate, UserId) -> TodoEntity,
    private val updateTodo: (TodoId, Todo) -> TodoEntity,
    private val deleteTodo: (TodoId) -> Unit
) {
    companion object {
        private val lens = bodyLens<TodoDTO>()
        private val lensList = bodyLens<List<TodoDTO>>()
        private val createLens = bodyLens<TodoCreate>()
        private val patchLens = bodyLens<TodoPatch>()

        private val idPath: BiDiPathLens<TodoId> = Path.uuid().of("id")
    }

    private val deleteById = idPath andThen deleteTodo

    fun findAll(request: Request): Response {
        val userId = credentials(request).userId
        val list = findTodos(userId).map(TodoEntity::toDTO)
        return Response(Status.OK).with(lensList of list)
    }

    fun findOne(request: Request): Response {
        // TODO: Check authorization
        val id = idPath(request)
        val todo = findTodo(id)?.toDTO() ?: throw EntityNotFoundException("Todo", id)
        return Response(Status.OK).with(lens of todo)
    }

    fun create(request: Request): Response {
        val userId = credentials(request).userId
        val body = createLens(request)
        val todo = createTodo(body, userId).toDTO()
        return Response(Status.CREATED).with(lens of todo)
    }

    fun patch(request: Request): Response {
        val id = idPath(request)
        val todo = findTodo(id) ?: throw EntityNotFoundException("Todo", id)

        val body = patchLens(request)
        val patched = body.patch(todo.payload)
        val updated = updateTodo(todo.id, patched).toDTO()

        return Response(Status.OK).with(lens of updated)
    }

    fun delete(request: Request): Response {
        deleteById(request)

        return Response(Status.OK)
    }
}
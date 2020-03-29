package com.tsovedenski.todo.handlers

import com.tsovedenski.todo.*
import com.tsovedenski.todo.Permission.*
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
    private val permissions: PermissionVerifier,
    private val findTodos: (UserId) -> List<TodoEntity>,
    private val findTodo: (TodoId) -> TodoEntity?,
    private val createTodo: (TodoCreate, UserId) -> TodoEntity,
    private val updateTodo: (TodoEntity, TodoPatch) -> TodoEntity,
    private val deleteTodo: (TodoId) -> Unit
) {
    companion object {
        private val lens = bodyLens<TodoDTO>()
        private val lensList = bodyLens<List<TodoDTO>>()
        private val createLens = bodyLens<TodoCreate>()
        private val patchLens = bodyLens<TodoPatch>()

        private val idPath: BiDiPathLens<TodoId> = Path.uuid().of("id")
    }

    fun findAll(request: Request): Response {
        val authentication = credentials(request)
        with(permissions) { authentication can ListTodos }

        val userId = credentials(request).userId
        val list = findTodos(userId).map(TodoEntity::toDTO)
        return Response(Status.OK).with(lensList of list)
    }

    fun create(request: Request): Response {
        val authentication = credentials(request)
        with(permissions) { authentication can CreateTodo }

        val userId = authentication.userId
        val body = TodoCreate.validator.run { createLens(request).validate() }
        val todo = createTodo(body, userId).toDTO()
        return Response(Status.CREATED).with(lens of todo)
    }

    fun patch(request: Request): Response {
        val todo = resolveById(request)

        val authentication = credentials(request)
        with(permissions) { authentication can EditTodo(todo.payload) }

        val patch  = TodoPatch.validator.run { patchLens(request).validate() }
        val updated = updateTodo(todo, patch).toDTO()

        return Response(Status.OK).with(lens of updated)
    }

    fun delete(request: Request): Response {
        val todo = resolveById(request)

        val authentication = credentials(request)
        with(permissions) { authentication can DeleteTodo(todo.payload) }

        deleteTodo(todo.id)

        return Response(Status.NO_CONTENT)
    }

    private fun resolveById(request: Request): TodoEntity {
        val id = idPath(request)
        return findTodo(id)
            ?: throw EntityNotFoundException("Todo", id)
    }
}
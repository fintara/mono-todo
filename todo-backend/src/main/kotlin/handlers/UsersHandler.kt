package com.tsovedenski.todo.handlers

import com.tsovedenski.todo.Authentication
import com.tsovedenski.todo.andThen
import com.tsovedenski.todo.body
import com.tsovedenski.todo.bodyLens
import com.tsovedenski.todo.exceptions.EntityNotFoundException
import com.tsovedenski.todo.models.*
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status

/**
 * Created by Tsvetan Ovedenski on 10/03/2020.
 */
class UsersHandler (
    private val credentials: (Request) -> Authentication,
    private val findById: (UserId) -> UserEntity?,
    private val updateUser: (UserEntity, UserPatch) -> UserEntity
) {

    companion object {
        private val patchLens = bodyLens<UserPatch>()
    }

    private val findByCredentials = credentials andThen Authentication::userId andThen findById

    fun me(request: Request): Response {
        val user = resolveMe(request)
        return Response(Status.OK).body(user.toDTO())
    }

    fun editMe(request: Request): Response {
        val user = resolveMe(request)
        val patch  = patchLens(request)
        val updated = updateUser(user, patch).toDTO()

        return Response(Status.OK).body(updated)
    }

    private fun resolveMe(request: Request): UserEntity =
        findByCredentials(request)
            ?: throw EntityNotFoundException("User", "me")
}
package com.tsovedenski.todo.handlers

import com.tsovedenski.todo.Authentication
import com.tsovedenski.todo.andThen
import com.tsovedenski.todo.body
import com.tsovedenski.todo.exceptions.EntityNotFoundException
import com.tsovedenski.todo.models.UserEntity
import com.tsovedenski.todo.models.UserId
import com.tsovedenski.todo.models.toDTO
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status

/**
 * Created by Tsvetan Ovedenski on 10/03/2020.
 */
class UsersHandler (
    private val credentials: (Request) -> Authentication,
    private val findById: (UserId) -> UserEntity?
) {
    private val findByCredentials = credentials andThen Authentication::userId andThen findById

    fun me(request: Request): Response {
        val user = findByCredentials(request) ?: throw EntityNotFoundException("User", "me")
        return Response(Status.OK).body(user.toDTO())
    }
}
package com.tsovedenski.todo.handlers

import com.tsovedenski.todo.Authentication
import com.tsovedenski.todo.Authenticator
import com.tsovedenski.todo.bodyLens
import com.tsovedenski.todo.models.Credentials
import com.tsovedenski.todo.models.Registration
import com.tsovedenski.todo.models.UserEntity
import org.http4k.core.*

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */
class AuthHandler (
    private val authenticator: Authenticator,
    private val findByCredentials: (Credentials) -> UserEntity?,
    private val insertUser: (Registration) -> Unit
) {
    companion object {
        private val credentialsLens = bodyLens<Credentials>()
        private val registrationLens = bodyLens<Registration>()
        private val tokenLens = bodyLens<Token>()
    }

    fun login(request: Request): Response {
        val body = credentialsLens(request)
        val user = findByCredentials(body) ?: return badCredentials()
        return goodCredentials(user)
    }

    fun signup(request: Request): Response {
        // TODO: fields validation
        val body = registrationLens(request)
        insertUser(body)
        return Response(Status.CREATED)
    }

    private fun goodCredentials(user: UserEntity) =
        Response(Status.OK).with(tokenLens of Token(authenticator.token(Authentication(user.id))))

    private fun badCredentials() =
        Response(Status.UNAUTHORIZED)

    private data class Token (val token: String)
}
package com.tsovedenski.todo.handlers

import com.tsovedenski.todo.*
import com.tsovedenski.todo.exceptions.AuthenticationError
import com.tsovedenski.todo.exceptions.RegistrationError
import com.tsovedenski.todo.models.Credentials
import com.tsovedenski.todo.models.Registration
import com.tsovedenski.todo.models.UserEntity
import com.tsovedenski.todo.models.UserId
import org.http4k.core.*

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */
class AuthHandler (
    private val authenticator: Authenticator,
    private val findByCredentials: (Credentials) -> Either<AuthenticationError, UserEntity>,
    private val insertUser: (Registration) -> Either<RegistrationError, UserId>
) {
    companion object {
        private val credentialsLens = bodyLens<Credentials>()
        private val registrationLens = bodyLens<Registration>()
    }

    fun login(request: Request): Response {
        val body = Credentials.validate(credentialsLens(request)).valid()
        return findByCredentials(body).fold(
            { Response(Status.UNAUTHORIZED) },
            { user -> Response(Status.OK).body(Token(authenticator.token(Authentication(user.id)))) }
        )
    }

    fun signup(request: Request): Response {
        val body = Registration.validate(registrationLens(request)).valid()
        return insertUser(body).fold(
            { Response(Status.BAD_REQUEST).body(it) },
            { Response(Status.NO_CONTENT) }
        )
    }

    private data class Token (val token: String)
}
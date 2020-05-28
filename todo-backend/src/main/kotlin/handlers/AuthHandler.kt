package com.tsovedenski.todo.handlers

import com.tsovedenski.todo.*
import com.tsovedenski.todo.exceptions.AuthenticationError
import com.tsovedenski.todo.exceptions.RegistrationError
import com.tsovedenski.todo.models.*
import com.tsovedenski.todo.models.Credentials
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

    private val userToToken = UserEntity::id andThen
            ::Authentication andThen
            authenticator::token andThen
            ::Token

    fun login(request: Request): Response {
        val body = Credentials.validator.run { credentialsLens(request).validate() }
        return findByCredentials(body)
            .map(userToToken)
            .fold(
                { Response(Status.UNAUTHORIZED) },
                { token -> Response(Status.OK).body(token) }
            )
    }

    fun signup(request: Request): Response {
        val body = Registration.validator.run { registrationLens(request).validate() }
        return insertUser(body).fold(
            { Response(Status.BAD_REQUEST).body(it) },
            { Response(Status.NO_CONTENT) }
        )
    }

    private data class Token (val token: String)
}
package com.tsovedenski.todo.services

import com.tsovedenski.todo.*
import com.tsovedenski.todo.database.TxManager
import com.tsovedenski.todo.database.repositories.UserRepository
import com.tsovedenski.todo.exceptions.AuthenticationError
import com.tsovedenski.todo.exceptions.DatabaseException
import com.tsovedenski.todo.exceptions.RegistrationError
import com.tsovedenski.todo.models.*

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */
interface UserService {
    fun findById(id: UserId): UserEntity?
    fun findByEmail(email: String): UserEntity?
    fun findByCredentials(credentials: Credentials): Either<AuthenticationError, UserEntity>
    fun create(form: Registration): Either<RegistrationError, UserId>
    fun update(user: UserEntity, patch: UserPatch): UserEntity
}

class UserServiceImpl (
    private val passwordEncoder: PasswordEncoder,
    private val tx: TxManager<UserRepository>
) : UserService {

    override fun findById(id: UserId): UserEntity? =
        tx { findById(id) }

    override fun findByEmail(email: String): UserEntity? =
        tx { findByEmail(email) }

    override fun findByCredentials(credentials: Credentials): Either<AuthenticationError, UserEntity> =
        findByEmail(credentials.email)
            .let {
                it?.right() ?: AuthenticationError.WrongEmail.left()
            }
            .flatMap {
                val check = passwordEncoder.check(it.payload.password, credentials.password)
                if (check) it.right()
                else AuthenticationError.WrongPassword.left()
            }

    override fun create(form: Registration): Either<RegistrationError, UserId> = tx {
        val existing = findByEmail(form.email)
        if (existing != null) {
            RegistrationError.EmailExists(form.email).left()
        } else {
            val user = User(
                email = form.email,
                password = passwordEncoder.encode(form.password),
                name = form.name?.takeIf { it.isNotBlank() }
            )
            insert(user).right()
        }
    }

    override fun update(user: UserEntity, patch: UserPatch): UserEntity = tx {
        val patched = user.payload.apply(patch)
        save(user.id, patched)
        findById(user.id) ?: throw DatabaseException.CouldNotUpdate
    }
}
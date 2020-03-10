package com.tsovedenski.todo.services

import com.tsovedenski.todo.PasswordEncoder
import com.tsovedenski.todo.database.TxManager
import com.tsovedenski.todo.database.repositories.UserRepository
import com.tsovedenski.todo.models.*

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */
interface UserService {
    fun findById(id: UserId): UserEntity?
    fun findByEmail(email: String): UserEntity?
    fun findByCredentials(credentials: Credentials): UserEntity?
    fun create(form: Registration): UserId
}

class UserServiceImpl (
    private val passwordEncoder: PasswordEncoder,
    private val tx: TxManager<UserRepository>
) : UserService {

    override fun findById(id: UserId): UserEntity? =
        tx { findById(id) }

    override fun findByEmail(email: String): UserEntity? =
        tx { findByEmail(email) }

    override fun findByCredentials(credentials: Credentials): UserEntity? = findByEmail(credentials.email)
        ?.takeIf { passwordEncoder.check(it.payload.password, credentials.password) }

    override fun create(form: Registration): UserId {
        val user = User(
            email = form.email,
            password = passwordEncoder.encode(form.password),
            name = form.name?.takeIf { it.isNotBlank() }
        )
        return tx { insert(user) }
    }
}
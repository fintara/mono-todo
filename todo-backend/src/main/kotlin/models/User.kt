package com.tsovedenski.todo.models

import com.tsovedenski.todo.annotations.Typescript
import com.tsovedenski.todo.database.Entity
import java.util.*

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */

typealias UserId = UUID

data class User (
    val email: String,
    val password: String,
    val name: String?
)

data class UserPatch (
    val name: String? = null
)

fun User.apply(patch: UserPatch): User {
    var out = copy()

    patch.name?.let { out = out.copy(name = it) }

    return out
}

typealias UserEntity = Entity<UserId, User>

@Typescript
data class UserDTO (
    val name: String
)

fun UserEntity.toDTO() = UserDTO(
    name = payload.name ?: payload.email
)
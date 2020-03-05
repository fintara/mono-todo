package com.tsovedenski.todo.models

import com.tsovedenski.todo.database.Entity
import java.util.*

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */

typealias UserId = UUID

data class User(
    val email: String,
    val password: String,
    val name: String?
)

typealias UserEntity = Entity<UserId, User>
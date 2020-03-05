package com.tsovedenski.todo.database

import org.jetbrains.exposed.dao.id.UUIDTable

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */

object Users : UUIDTable("users") {
    val email = varchar("email", 100)
    val password = varchar("password", 250)
    val name = varchar("name", 64).nullable()
}
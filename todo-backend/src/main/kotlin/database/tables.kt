package com.tsovedenski.todo.database

import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.`java-time`.timestamp

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */

object Users : UUIDTable("users") {
    val email = varchar("email", 100)
    val password = varchar("password", 250)
    val name = varchar("name", 64).nullable()
}

object Todos : UUIDTable("todos") {
    val userId = reference("user_id", Users)
    val content = text("content")
    val doneAt = timestamp("done_at").nullable()
    val createdAt = timestamp("created_at")
}
package com.tsovedenski.todo.database.repositories

import com.tsovedenski.todo.database.Entity
import com.tsovedenski.todo.database.Users
import com.tsovedenski.todo.models.User
import com.tsovedenski.todo.models.UserEntity
import com.tsovedenski.todo.models.UserId
import org.jetbrains.exposed.sql.*

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */
interface UserRepository : CrudRepository<UserId, User> {
    fun findByEmail(email: String): UserEntity?
}

object ExposedUserRepository : UserRepository {
    override fun findById(id: UserId): UserEntity? = Users
        .select { Users.id eq id }
        .firstOrNull()
        ?.toUser()

    override fun findByEmail(email: String): UserEntity? = Users
        .select { Users.email eq email }
        .firstOrNull()
        ?.toUser()

    override fun insert(item: User): UserId = Users.insertAndGetId {
        it[email] = item.email
        it[password] = item.password
        it[name] = item.name
    }.value

    override fun save(id: UserId, item: User) {
        Users.update({ Users.id eq id }) {
            it[email] = item.email
            it[password] = item.password
            it[name] = item.name
        }
    }

    override fun deleteById(id: UserId) {
        Users.deleteWhere { Users.id eq id }
    }

    override fun deleteAll() {
        Users.deleteAll()
    }
}

fun ResultRow.toUser() = UserEntity(
    id = this[Users.id].value,
    payload = User(
        email = this[Users.email],
        password = this[Users.password],
        name = this[Users.name]
    )
)
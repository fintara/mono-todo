package com.tsovedenski.todo.test

import com.tsovedenski.todo.database.Entity
import com.tsovedenski.todo.database.TxManager
import com.tsovedenski.todo.database.repositories.CrudRepository
import com.tsovedenski.todo.database.repositories.UserRepository
import com.tsovedenski.todo.models.User
import com.tsovedenski.todo.models.UserEntity
import com.tsovedenski.todo.models.UserId
import java.util.*
import java.util.concurrent.ConcurrentHashMap

/**
 * Created by Tsvetan Ovedenski on 28/05/2020.
 */
val uuidGenerator: () -> UUID = { UUID.randomUUID() }

fun <ID: Any, T: Any> inMemoryRepository(
    idGenerator: () -> ID,
    database: MutableMap<ID, Entity<ID, T>>
): CrudRepository<ID, T> =
    object : CrudRepository<ID, T> {
        override fun deleteAll() {
            database.clear()
        }

        override fun findById(id: ID): Entity<ID, T>? {
            return database[id]
        }

        override fun insert(item: T): ID {
            val id = idGenerator()
            database[id] = Entity(id, item)
            return id
        }

        override fun save(id: ID, item: T) {
            database[id] = Entity(id, item)
        }

        override fun deleteById(id: ID) {
            database.remove(id)
        }

    }

class InMemoryUserRepository(
    private val database: MutableMap<UserId, UserEntity> = ConcurrentHashMap(),
    crud: CrudRepository<UserId, User> = inMemoryRepository(uuidGenerator, database)
) : UserRepository, CrudRepository<UserId, User> by crud {
    override fun findByEmail(email: String): UserEntity? =
        database.values.find { it.payload.email == email }
}

fun <R> inMemoryTx(repository: R): TxManager<R> = object : TxManager<R> {
    override fun <T> tx(block: R.() -> T): T = block(repository)
}
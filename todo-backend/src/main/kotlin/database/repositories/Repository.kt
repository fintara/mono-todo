package com.tsovedenski.todo.database.repositories

import com.tsovedenski.todo.database.Entity

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */
interface Repository {
    fun deleteAll()
}

interface CrudRepository <ID : Any, T : Any> : Repository {
    fun findById(id: ID): Entity<ID, T>?
    fun insert(item: T): ID
    fun save(id: ID, item: T)
    fun deleteById(id: ID)
}
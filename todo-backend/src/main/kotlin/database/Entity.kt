package com.tsovedenski.todo.database

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */

data class Entity <ID : Any, T : Any> (
    val id: ID,
    val payload: T
)
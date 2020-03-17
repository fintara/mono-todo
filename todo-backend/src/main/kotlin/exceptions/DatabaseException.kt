package com.tsovedenski.todo.exceptions

/**
 * Created by Tsvetan Ovedenski on 07/03/2020.
 */
sealed class DatabaseException {
    object CouldNotInsert : RuntimeException()
    object CouldNotUpdate : RuntimeException()
}


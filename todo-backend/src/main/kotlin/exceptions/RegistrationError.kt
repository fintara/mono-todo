package com.tsovedenski.todo.exceptions

/**
 * Created by Tsvetan Ovedenski on 15/03/2020.
 */
sealed class RegistrationError {
    data class EmailExists(val value: String) : RegistrationError()
}

package com.tsovedenski.todo.exceptions

/**
 * Created by Tsvetan Ovedenski on 15/03/2020.
 */
sealed class AuthenticationError {
    object WrongEmail : AuthenticationError()
    object WrongPassword : AuthenticationError()
}

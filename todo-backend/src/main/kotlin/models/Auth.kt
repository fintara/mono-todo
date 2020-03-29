package com.tsovedenski.todo.models

import com.tsovedenski.todo.*
import com.tsovedenski.todo.annotations.Typescript

/**
 * Created by Tsvetan Ovedenski on 03/03/2020.
 */

@Typescript
data class Credentials(
    val email: String,
    val password: String
) {
    companion object {
        val validator = createValidator<Credentials> {
            email(Credentials::email)
            password(Credentials::password)
        }
    }
}

@Typescript
data class Registration(
    val email: String,
    val password: String,
    val name: String?
) {
    companion object {
        val validator = createValidator<Registration> {
            email(Registration::email)
            password(Registration::password)
            field(Registration::name, "name") {
                notBlank
            }
        }
    }
}

private fun <T> Spec<T>.email(selector: (T) -> String) = field(selector, "email") {
    notBlank
    email
}

private fun <T> Spec<T>.password(selector: (T) -> String) = field(selector, "password") {
    minLength(6)
}
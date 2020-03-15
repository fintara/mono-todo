package com.tsovedenski.todo.models

import com.tsovedenski.todo.annotations.Typescript

/**
 * Created by Tsvetan Ovedenski on 03/03/2020.
 */

@Typescript
data class Registration (
    val email: String,
    val password: String,
    val name: String?
)

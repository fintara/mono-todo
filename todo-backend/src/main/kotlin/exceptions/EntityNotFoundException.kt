package com.tsovedenski.todo.exceptions

data class EntityNotFoundException (val name: String, val identifier: Any) : IllegalArgumentException()
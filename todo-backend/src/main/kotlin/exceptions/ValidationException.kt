package com.tsovedenski.todo.exceptions

import com.tsovedenski.todo.ValidationError

/**
 * Created by Tsvetan Ovedenski on 15/03/2020.
 */
class ValidationException (val errors: Set<ValidationError>) : IllegalArgumentException()
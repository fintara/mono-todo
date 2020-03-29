package com.tsovedenski.todo

import com.tsovedenski.todo.exceptions.ValidationException

/**
 * Created by Tsvetan Ovedenski on 15/03/2020.
 */

interface Validated <T> {
    val spec: Validation<T>
    fun T.validateVerbose(): ValidationResult<T> = spec(this)
    fun T.validate(): T = validateVerbose().valid()
}

typealias ValidationResult <T> = Either<Set<ValidationError>, T>
typealias Validation <T> = (T) -> ValidationResult<T>

data class ValidationError (val field: String, val violation: String)

fun <T> ValidationResult<T>.valid(): T = getOrThrow(::ValidationException)

@DslMarker
annotation class ValidationDsl

@ValidationDsl
class Spec <T> {

    private val fields = mutableListOf<(T) -> Set<ValidationError>>()

    fun <R> field(selector: (T) -> R?, name: String, body: FieldSpec<R>.() -> Unit) {
        val constraints = mutableListOf<Constraint<R>>()
        val spec = FieldSpec(constraints)
        spec.body()

        fields.add { item ->
            val value = selector(item)
            if (value == null) emptySet()
            else constraints.mapNotNull { constraint ->
                if (constraint.predicate(value)) null
                else ValidationError(name, constraint.name)
            }.toSet()
        }
    }

    fun asValidation(): Validation<T> = { item ->
        val result = fields.flatMap { it(item) }
        if (result.isEmpty()) item.right()
        else result.toSet().left()
    }
}

@ValidationDsl
class FieldSpec <out R> (private val list: MutableList<Constraint<R>>) {
    fun add(constraint: Constraint<R>) {
        list.add(constraint)
    }
}

val FieldSpec<String>.notEmpty get() = add(Constraint.NotEmpty)
val FieldSpec<String>.notBlank get() = add(Constraint.NotBlank)
val FieldSpec<String>.email get() = add(Constraint.Email)
fun FieldSpec<String>.minLength(value: Int) = add(Constraint.MinLength(value))
fun FieldSpec<String>.maxLength(value: Int) = add(Constraint.MaxLength(value))

fun FieldSpec<Int>.min(value: Int) = add(Constraint.Min(value))
fun FieldSpec<Int>.max(value: Int) = add(Constraint.Max(value))

fun FieldSpec<Iterable<Any?>>.size(value: Int) = add(Constraint.Iterable.Size(value))
fun <T> FieldSpec<Iterable<T>>.all(body: FieldSpec<T>.() -> Unit) {
    val list = mutableListOf<Constraint<T>>()
    val spec = FieldSpec(list)
    spec.body()
    list.forEach {
        add(Constraint.Iterable.All(it))
    }
}

abstract class Constraint <in T> (val name: String, val predicate: (T) -> Boolean) {

    companion object {
        // https://gist.github.com/ironic-name/f8e8479c76e80d470cacd91001e7b45b
        private val EMAIL_REGEX =
            "^(([\\w-]+\\.)+[\\w-]+|([a-zA-Z]|[\\w-]{2,}))@((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9]))|([a-zA-Z]+[\\w-]+\\.)+[a-zA-Z]{2,4})$".toRegex()
    }

    object NotEmpty : Constraint<String>("not_empty", String::isNotEmpty)
    object NotBlank : Constraint<String>("not_blank", String::isNotBlank)
    object Email : Constraint<String>("email", EMAIL_REGEX::matches)
    data class MinLength(val value: Int) : Constraint<String>("min_length:$value", { it.length >= value })
    data class MaxLength(val value: Int) : Constraint<String>("min_length:$value", { it.length <= value })

    data class Min(val value: Int) : Constraint<Int>("min:$value", { it >= value })
    data class Max(val value: Int) : Constraint<Int>("max:$value", { it <= value })

    abstract class Iterable <in E> (name: String, predicate: (kotlin.collections.Iterable<E>) -> Boolean)
        : Constraint<kotlin.collections.Iterable<E>>("iterable_$name", predicate) {
        data class Size (val value: Int) : Iterable<Any?>("size", { it.count() == value })
        data class All <E> (val constraint: Constraint<E>) : Iterable<E>("all", { it.all(constraint.predicate) })
    }
}

fun <T> createSpec(body: Spec<T>.() -> Unit): Validation<T> {
    return Spec<T>().apply(body).asValidation()
}

fun <T> createValidator(body: Spec<T>.() -> Unit): Validated<T> =
    object : Validated<T> {
        override val spec: Validation<T> = createSpec(body)
    }
package com.tsovedenski.todo

import com.tsovedenski.todo.exceptions.UnauthorizedException
import com.tsovedenski.todo.models.Todo

/**
 * Created by Tsvetan Ovedenski on 17/03/2020.
 */
sealed class Permission (val name: String) {
    object ListTodos : Permission("todo.list")
    object CreateTodo : Permission("todo.create")
    data class EditTodo (val subject: Todo) : Permission("todo.edit")
    data class DeleteTodo (val subject: Todo) : Permission("todo.delete")

    override fun toString(): String = name
}

interface PermissionVerifier {
    infix fun Authentication.can(permission: Permission) {
        if (!check(this, permission)) {
            throw UnauthorizedException(permission)
        }
    }

    fun check(authentication: Authentication, permission: Permission): Boolean
}

object DefaultPermissionVerifier : PermissionVerifier {
    override fun check(authentication: Authentication, permission: Permission): Boolean = when (permission) {
        is Permission.EditTodo   -> permission.subject.userId == authentication.userId
        is Permission.DeleteTodo -> permission.subject.userId == authentication.userId
        else -> true
    }
}

//object ScopedPermissionVerifier(
//    private val tx: TxManager<PermissionRepository>
//) : PermissionVerifier {
//
//    override fun check(authentication: Authentication, permission: Permission): Boolean = tx {
//        permission.name in authentication.scopes && DefaultPermissionVerifier.check(authentication, permission)
//    }
//}

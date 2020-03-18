package com.tsovedenski.todo.exceptions

import com.tsovedenski.todo.Permission

/**
 * Created by Tsvetan Ovedenski on 17/03/2020.
 */
class UnauthorizedException (val permission: Permission) : IllegalStateException()
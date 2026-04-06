package com.valentinesgarage.model

data class Task(
    val id: String = "",
    val truckId: String = "",
    val taskName: String = "",
    val isDone: Boolean = false,
    val notes: String = "",
    val mechanicName: String = "",
    val timestamp: Long = System.currentTimeMillis()
)
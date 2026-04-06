package com.valentinesgarage.model

data class Truck(
    val id: String = "",
    val truckNumber: String = "",
    val driverName: String = "",
    val kilometers: String = "",
    val condition: String = "",
    val checkedInBy: String = "",
    val timestamp: Long = System.currentTimeMillis()
)
package com.valentinesgarage.ui.receptionist

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.valentinesgarage.R
import com.valentinesgarage.model.Truck

class CheckInActivity : AppCompatActivity() {

    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_check_in)

        val etTruck = findViewById<EditText>(R.id.etTruckNumber)
        val etDriver = findViewById<EditText>(R.id.etDriverName)
        val etKm = findViewById<EditText>(R.id.etKilometers)
        val rgCondition = findViewById<RadioGroup>(R.id.rgCondition)
        val btnCheckIn = findViewById<Button>(R.id.btnCheckIn)
        val tvStatus = findViewById<TextView>(R.id.tvStatus)

        btnCheckIn.setOnClickListener {
            val truckNum = etTruck.text.toString().trim()
            val driver = etDriver.text.toString().trim()
            val km = etKm.text.toString().trim()
            val selectedId = rgCondition.checkedRadioButtonId

            if (truckNum.isEmpty() || driver.isEmpty() || km.isEmpty() || selectedId == -1) {
                tvStatus.setTextColor(getColor(android.R.color.holo_red_light))
                tvStatus.text = "Please fill in all fields"
                return@setOnClickListener
            }

            val condition = findViewById<RadioButton>(selectedId).text.toString()
            val userEmail = auth.currentUser?.email ?: "unknown"

            val truck = Truck(
                truckNumber = truckNum,
                driverName = driver,
                kilometers = km,
                condition = condition,
                checkedInBy = userEmail
            )

            db.collection("trucks").add(truck)
                .addOnSuccessListener {
                    tvStatus.setTextColor(getColor(android.R.color.holo_green_light))
                    tvStatus.text = "✅ Truck $truckNum checked in successfully!"
                    etTruck.text.clear()
                    etDriver.text.clear()
                    etKm.text.clear()
                    rgCondition.clearCheck()
                }
                .addOnFailureListener {
                    tvStatus.setTextColor(getColor(android.R.color.holo_red_light))
                    tvStatus.text = "Error: ${it.message}"
                }
        }
    }
}
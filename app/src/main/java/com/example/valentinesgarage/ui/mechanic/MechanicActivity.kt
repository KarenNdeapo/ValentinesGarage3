package com.valentinesgarage.ui.mechanic

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.valentinesgarage.R
import com.valentinesgarage.model.Task
import com.valentinesgarage.model.Truck

class MechanicActivity : AppCompatActivity() {

    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()
    private val truckList = mutableListOf<Truck>()
    private val truckLabels = mutableListOf<String>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_mechanic)

        val spinner = findViewById<Spinner>(R.id.spinnerTrucks)
        val etTask = findViewById<EditText>(R.id.etTaskName)
        val etNotes = findViewById<EditText>(R.id.etNotes)
        val cbDone = findViewById<CheckBox>(R.id.cbDone)
        val btnSave = findViewById<Button>(R.id.btnSaveTask)
        val tvStatus = findViewById<TextView>(R.id.tvMechanicStatus)

        // Load trucks into spinner
        db.collection("trucks").get().addOnSuccessListener { result ->
            for (doc in result) {
                val truck = doc.toObject(Truck::class.java).copy(id = doc.id)
                truckList.add(truck)
                truckLabels.add("${truck.truckNumber} - ${truck.driverName}")
            }
            val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, truckLabels)
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            spinner.adapter = adapter
        }

        btnSave.setOnClickListener {
            val taskName = etTask.text.toString().trim()
            val notes = etNotes.text.toString().trim()

            if (truckList.isEmpty()) {
                tvStatus.text = "No trucks loaded yet"
                return@setOnClickListener
            }
            if (taskName.isEmpty()) {
                tvStatus.text = "Please enter a task name"
                return@setOnClickListener
            }

            val selectedTruck = truckList[spinner.selectedItemPosition]
            val mechanicEmail = auth.currentUser?.email ?: "unknown"

            val task = Task(
                truckId = selectedTruck.id,
                taskName = taskName,
                isDone = cbDone.isChecked,
                notes = notes,
                mechanicName = mechanicEmail
            )

            db.collection("tasks").add(task)
                .addOnSuccessListener {
                    tvStatus.setTextColor(getColor(android.R.color.holo_green_light))
                    tvStatus.text = "✅ Task saved!"
                    etTask.text.clear()
                    etNotes.text.clear()
                    cbDone.isChecked = false
                }
                .addOnFailureListener {
                    tvStatus.setTextColor(getColor(android.R.color.holo_red_light))
                    tvStatus.text = "Error: ${it.message}"
                }
        }
    }
}
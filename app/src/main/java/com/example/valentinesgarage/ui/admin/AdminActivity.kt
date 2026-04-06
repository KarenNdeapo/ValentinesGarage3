package com.valentinesgarage.ui.admin

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.firestore.FirebaseFirestore
import com.valentinesgarage.R
import com.valentinesgarage.model.Task
import com.valentinesgarage.model.Truck

private val firestore: Any

class AdminActivity : AppCompatActivity() {

    private val db = FirebaseFirestore.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin)

        val tvReport = findViewById<TextView>(R.id.tvReport)
        val sb = StringBuilder()

        // Load all trucks then match tasks
        db.collection("trucks").get().addOnSuccessListener { truckDocs ->
            val trucks = truckDocs.map { it.toObject(Truck::class.java).copy(id = it.id) }

            db.collection("tasks").get().addOnSuccessListener { taskDocs ->
                val tasks = taskDocs.map { it.toObject(Task::class.java).copy(id = it.id) }

                for (truck in trucks) {
                    sb.appendLine("🚛 Truck: ${truck.truckNumber}")
                    sb.appendLine("   Driver: ${truck.driverName}")
                    sb.appendLine("   KM: ${truck.kilometers}")
                    sb.appendLine("   Condition at check-in: ${truck.condition}")
                    sb.appendLine("   Checked in by: ${truck.checkedInBy}")
                    sb.appendLine("   ─────────────────────")

                    val truckTasks = tasks.filter { it.truckId == truck.id }
                    if (truckTasks.isEmpty()) {
                        sb.appendLine("   No tasks logged yet.")
                    } else {
                        for (task in truckTasks) {
                            val status = if (task.isDone) "✅" else "⏳"
                            sb.appendLine("   $status ${task.taskName}")
                            sb.appendLine("      By: ${task.mechanicName}")
                            if (task.notes.isNotEmpty())
                                sb.appendLine("      Notes: ${task.notes}")
                        }
                    }
                    sb.appendLine()
                }

                tvReport.text = if (sb.isEmpty()) "No data yet." else sb.toString()
            }
        }
    }
}
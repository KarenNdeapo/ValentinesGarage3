package com.valentinesgarage.ui

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.valentinesgarage.R
import com.valentinesgarage.ui.admin.AdminActivity
import com.valentinesgarage.ui.mechanic.MechanicActivity
import com.valentinesgarage.ui.receptionist.CheckInActivity

class LoginActivity : AppCompatActivity() {

    private lateinit var auth: FirebaseAuth
    private lateinit var db: FirebaseFirestore

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        auth = FirebaseAuth.getInstance()
        db = FirebaseFirestore.getInstance()

        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val btnLogin = findViewById<Button>(R.id.btnLogin)
        val tvError = findViewById<TextView>(R.id.tvError)

        btnLogin.setOnClickListener {
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                tvError.text = "Please fill in all fields"
                return@setOnClickListener
            }

            auth.signInWithEmailAndPassword(email, password)
                .addOnSuccessListener { result ->
                    val uid = result.user!!.uid
                    // Fetch role from Firestore
                    db.collection("users").document(uid).get()
                        .addOnSuccessListener { doc ->
                            when (doc.getString("role")) {
                                "receptionist" -> startActivity(Intent(this, CheckInActivity::class.java))
                                "mechanic" -> startActivity(Intent(this, MechanicActivity::class.java))
                                "admin" -> startActivity(Intent(this, AdminActivity::class.java))
                                else -> tvError.text = "Unknown role"
                            }
                            finish()
                        }
                }
                .addOnFailureListener {
                    tvError.text = "Login failed: ${it.message}"
                }
        }
    }
}
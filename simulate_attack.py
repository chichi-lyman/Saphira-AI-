import os
import psycopg2
from psycopg2 import errors

# Simulation parameters: Attempting an adversarial cross-tenant data breach
DATABASE_URL = os.environ.get("DATABASE_URL")
ATTACKER_TENANT_ID = "22222222-2222-2222-2222-222222222222" # Compromised entity session
VICTIM_TENANT_ID = "11111111-1111-1111-1111-111111111111"   # Target Law Firm data

def simulate_cross_tenant_attack():
    if not DATABASE_URL:
        print("[!] DATABASE_URL not set. Skipping attack simulation execution.")
        return
        
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        try:
            # Step 1: Initialize session bound exclusively to the Attacker's Tenant Token
            cursor.execute("BEGIN;")
            cursor.execute(f"SET LOCAL app.current_tenant_id = '{ATTACKER_TENANT_ID}';")
            
            print("[!] Attacker session initialized. Attempting unauthorized query...")
            
            # Step 2: Malicious script attempts to force-read data belonging to the Target Firm
            cursor.execute(f"SELECT file_name, raw_text FROM corporate_documents WHERE tenant_id = '{VICTIM_TENANT_ID}';")
            leaked_records = cursor.fetchall()
            
            if len(leaked_records) > 0:
                print(f"[CRITICAL FAIL] Security Wall Breached! Leaked data: {leaked_records}")
            else:
                print("[SUCCESS] Query executed, but returned 0 rows. PostgreSQL Row-Level Security successfully blinded the attacker.")
                
        except Exception as e:
            print(f"[SUCCESS] Database engine intercepted and hard-rejected the transaction block: {e}")
        finally:
            cursor.execute("ROLLBACK;")
            cursor.close()
            conn.close()
            
    except Exception as e:
        print(f"Failed to connect to database: {e}")

if __name__ == "__main__":
    simulate_cross_tenant_attack()

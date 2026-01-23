import pandas as pd
import numpy as np

# Create a messy dataset
data = {
    'Customer_ID': [1, 2, 2, 4, 5, 6, 7, 8, 9, 10],
    'Name': [' John Doe ', 'Jane Smith', 'Jane Smith', 'Bob Brown', 'Alice Green', ' Charlie ', 'David ', '', 'Eve', 'Frank'],
    'Email': ['john@example.com', 'jane@test', 'jane@test', 'bob@example', 'alice@domain.com', 'charlie@web.com', 'david@mail.com', 'unknown', 'eve@site.com', 'frank@box.com'],
    'Age': [25, 30, 30, None, 45, 150, 22, 28, 35, 40],
    'Joining_Date': ['2023-01-01', '2023/02/15', '2023/02/15', 'March 10, 2023', '2023-05-20', '2023-06-01', '2023-07-01', '2023-08-01', '2023-09-01', '2023-10-01'],
    'City': ['New York', 'Los Angeles', 'Los Angeles', 'Chicago', None, 'New York', 'Austin', 'Seattle', 'Chicago', 'Miami']
}

df = pd.DataFrame(data)

# Save to public folder of frontend for easy access
df.to_csv('c:/Users/User/OneDrive/Pictures/Documents/bse_sem1.R programing/ANTI GRAVITY all files/aryankule-08-a11y/Data_Refinery/frontend/public/sample_data.csv', index=False)
print("Sample dataset created at public/sample_data.csv")

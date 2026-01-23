import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer
from scipy import stats

class DataCleaner:
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.original_df = df.copy()
        self.actions_performed = []
        self.stats = {
            "initial_rows": len(df),
            "initial_cols": len(df.columns),
            "duplicates_removed": 0,
            "missing_values_fixed": 0,
            "outliers_removed": 0
        }

    def clean(self):
        # 1. Remove Duplicates
        initial_count = len(self.df)
        self.df.drop_duplicates(inplace=True)
        self.stats["duplicates_removed"] = initial_count - len(self.df)
        if self.stats["duplicates_removed"] > 0:
            self.actions_performed.append(f"Removed {self.stats['duplicates_removed']} duplicate rows")

        # 2. Handle Missing Values
        for col in self.df.columns:
            missing_count = self.df[col].isnull().sum()
            if missing_count > 0:
                if self.df[col].dtype in ['int64', 'float64']:
                    # Fill with median for numerical
                    median_val = self.df[col].median()
                    self.df[col] = self.df[col].fillna(median_val)
                else:
                    # Fill with mode for categorical
                    mode_val = self.df[col].mode()
                    if not mode_val.empty:
                        self.df[col] = self.df[col].fillna(mode_val[0])
                self.stats["missing_values_fixed"] += missing_count
        
        if self.stats["missing_values_fixed"] > 0:
            self.actions_performed.append(f"Handled {self.stats['missing_values_fixed']} missing values")

        # 3. Trim extra spaces & Normalize text
        for col in self.df.select_dtypes(include=['object']):
            self.df[col] = self.df[col].astype(str).str.strip()
        
        # 4. Detect & Handle Outliers (using Z-score for numerical columns)
        for col in self.df.select_dtypes(include=['int64', 'float64']).columns:
            z_scores = np.abs(stats.zscore(self.df[col].dropna()))
            outlier_indices = self.df.index[z_scores > 3]
            if len(outlier_indices) > 0:
                # Instead of dropping, we cap them or we could drop. Let's cap at 99th percentile
                upper_limit = self.df[col].quantile(0.99)
                self.df.loc[outlier_indices, col] = upper_limit
                self.stats["outliers_removed"] += len(outlier_indices)

        if self.stats["outliers_removed"] > 0:
            self.actions_performed.append(f"Capped {self.stats['outliers_removed']} outliers")

        return self.df, self.get_report_data()

    def get_quality_score(self):
        # A simple scoring logic
        total_missing = self.original_df.isnull().sum().sum()
        total_cells = self.original_df.size
        missing_penalty = (total_missing / total_cells) * 100
        
        duplicate_penalty = (self.stats["duplicates_removed"] / self.stats["initial_rows"]) * 100
        
        score = 100 - (missing_penalty + duplicate_penalty)
        return max(0, min(100, round(score, 2)))

    def get_report_data(self):
        score = self.get_quality_score()
        status = "✅ Industry-Ready" if score > 85 else "⚠️ Average" if score > 60 else "❌ Poor"
        
        return {
            "score": score,
            "status": status,
            "actions": self.actions_performed,
            "stats": self.stats,
            "column_summary": self.df.dtypes.astype(str).to_dict()
        }

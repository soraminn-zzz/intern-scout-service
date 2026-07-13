class CreateInternProfiles < ActiveRecord::Migration[8.1]
  def change
    create_table :intern_profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.string :school_name
      t.integer :graduation_year
      t.text :bio
      t.text :skills
      t.string :desired_position

      t.timestamps
    end
  end
end

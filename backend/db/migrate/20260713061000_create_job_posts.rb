class CreateJobPosts < ActiveRecord::Migration[8.1]
  def change
    create_table :job_posts do |t|
      t.references :company, null: false, foreign_key: { to_table: :users }
      t.string :title, null: false
      t.text :description, null: false
      t.text :required_skills
      t.string :location
      t.boolean :is_active, null: false, default: true

      t.timestamps
    end
  end
end

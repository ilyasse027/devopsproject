pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "ilyassepro/devopsproject"
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push("latest")
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl set image deployment/myapp-deployment myapp-container=${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh "kubectl rollout status deployment/myapp-deployment"
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded!'
            // Add notification steps here
        }
        failure {
            echo 'Pipeline failed!'
            // Add notification steps here
        }
    }
}
